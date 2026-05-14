package com.example.fccmStrReport.service;

import org.bouncycastle.bcpg.ArmoredOutputStream;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openpgp.*;
import org.bouncycastle.openpgp.operator.jcajce.JcaKeyFingerprintCalculator;
import org.bouncycastle.openpgp.operator.jcajce.JcePGPDataEncryptorBuilder;
import org.bouncycastle.openpgp.operator.jcajce.JcePublicKeyKeyEncryptionMethodGenerator;
import org.bouncycastle.openpgp.PGPObjectFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.SecureRandom;
import java.security.Security;
import java.util.Date;
import java.util.Iterator;

@Service
public class PgpEncryptionService {

    private final ResourceLoader resourceLoader;
    private final String publicKeyPath;

    public PgpEncryptionService(
            ResourceLoader resourceLoader,
            @Value("${app.pgp.public-key-path}") String publicKeyPath
    ) {
        this.resourceLoader = resourceLoader;
        this.publicKeyPath = publicKeyPath;
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }

    public byte[] encryptXmlToPgp(byte[] xmlBytes, String fileName) {
        try {
            PGPPublicKey encryptionKey = readEncryptionKey(loadPublicKeyStream());
            return encrypt(xmlBytes, fileName, encryptionKey);
        } catch (Exception e) {
            throw new IllegalStateException("PGP encryption failed: " + e.getMessage(), e);
        }
    }

    private InputStream loadPublicKeyStream() throws IOException {
        Resource resource = resourceLoader.getResource(publicKeyPath);
        if (!resource.exists()) {
            throw new IllegalArgumentException("PGP public key file not found: " + publicKeyPath);
        }
        return resource.getInputStream();
    }

    private PGPPublicKey readEncryptionKey(InputStream inputStream) throws IOException, PGPException {
        try (InputStream decoderStream = PGPUtil.getDecoderStream(inputStream)) {
            PGPObjectFactory objectFactory = new PGPObjectFactory(decoderStream, new JcaKeyFingerprintCalculator());
            Object obj;
            while ((obj = objectFactory.nextObject()) != null) {
                if (obj instanceof PGPPublicKeyRing keyRing) {
                    PGPPublicKey key = firstEncryptionKey(keyRing);
                    if (key != null) return key;
                } else if (obj instanceof PGPPublicKeyRingCollection keyRingCollection) {
                    Iterator<PGPPublicKeyRing> rings = keyRingCollection.getKeyRings();
                    while (rings.hasNext()) {
                        PGPPublicKey key = firstEncryptionKey(rings.next());
                        if (key != null) return key;
                    }
                }
                // Ignore other packet types like PGPSignatureList.
            }
        }
        throw new IllegalArgumentException("No PGP encryption public key found. Ensure recipient-public.asc contains a valid PUBLIC KEY BLOCK.");
    }

    private PGPPublicKey firstEncryptionKey(PGPPublicKeyRing keyRing) {
        Iterator<PGPPublicKey> keys = keyRing.getPublicKeys();
        while (keys.hasNext()) {
            PGPPublicKey key = keys.next();
            if (key.isEncryptionKey()) return key;
        }
        return null;
    }

    private byte[] encrypt(byte[] data, String fileName, PGPPublicKey encryptionKey) throws IOException, PGPException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        try (ArmoredOutputStream armoredOutput = new ArmoredOutputStream(output)) {
            ByteArrayOutputStream literalOut = new ByteArrayOutputStream();
            PGPCompressedDataGenerator compressedDataGenerator = new PGPCompressedDataGenerator(PGPCompressedData.ZIP);
            try (var compressedOut = compressedDataGenerator.open(literalOut)) {
                PGPLiteralDataGenerator literalDataGenerator = new PGPLiteralDataGenerator();
                try (var literalDataOut = literalDataGenerator.open(
                        compressedOut,
                        PGPLiteralData.BINARY,
                        fileName,
                        data.length,
                        new Date()
                )) {
                    literalDataOut.write(data);
                }
            } finally {
                compressedDataGenerator.close();
            }

            byte[] compressedData = literalOut.toByteArray();
            PGPEncryptedDataGenerator encryptedDataGenerator = new PGPEncryptedDataGenerator(
                    new JcePGPDataEncryptorBuilder(PGPEncryptedData.AES_256)
                            .setWithIntegrityPacket(true)
                            .setSecureRandom(new SecureRandom())
                            .setProvider(BouncyCastleProvider.PROVIDER_NAME)
            );
            encryptedDataGenerator.addMethod(
                    new JcePublicKeyKeyEncryptionMethodGenerator(encryptionKey)
                            .setProvider(BouncyCastleProvider.PROVIDER_NAME)
            );

            try (var encryptedOut = encryptedDataGenerator.open(armoredOutput, compressedData.length)) {
                encryptedOut.write(compressedData);
            } finally {
                encryptedDataGenerator.close();
            }
        }
        return output.toByteArray();
    }
}
