import type { Config } from '@/contexts/shared/domain/config.js';
import type { GenerateRegistrationOptionsOpts } from '@simplewebauthn/server';

export function getRegistrationOptions({
  email,
  config,
}: {
  email: string;
  config: Config;
}): GenerateRegistrationOptionsOpts {
  return {
    rpName: config.rpName,
    rpID: config.rpID,
    userName: email,
    userDisplayName: email,
    timeout: 60000,
    attestationType: 'none',
    excludeCredentials: [],
    authenticatorSelection: {
      residentKey: 'discouraged',
      userVerification: 'preferred',
    },
    supportedAlgorithmIDs: [-7, -257],
  };
}
