import { delay } from '@/shared/lib/delay';
import { useState } from 'react';

export function useLogin() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (loading) {
      return;
    }
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { email } = Object.fromEntries(formData.entries());
    setLoading(true);
    console.log({ email });
    await delay(2000);
    setLoading(false);
  }

  return { loading, handleSubmit };
}
