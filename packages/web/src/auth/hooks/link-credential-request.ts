import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { createCredentialRequestOptions } from '../services/create-credential-request-options';
import { startRegistration } from '@simplewebauthn/browser';
import { verifyCredentialRequestOptions } from '../services/verify-credential-request-options';
import { toast } from 'sonner';

export function useLinkCredentialRequest() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  async function linkCredentialRequest() {
    if (id == null) {
      return;
    }
    setLoading(true);
    await createCredentialRequestOptions({
      id,
    })
      .then(async (opts) => await startRegistration({ optionsJSON: opts }))
      .then(
        async (registrationResponse) =>
          await verifyCredentialRequestOptions({
            id,
            registrationResponse,
          }),
      )
      .then(({ verified }) => {
        if (verified) {
          toast.success(
            '¡El proceso de registro ha sido completado correctamente!',
          );
          setLocation('/login');
        } else {
          toast.error('No se ha podido verificar su registro.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { loading, linkCredentialRequest };
}
