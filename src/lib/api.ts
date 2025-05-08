export async function sendEmail(name: string, message: string, email?: string, phone?: string, company?: string) {
  const response = await fetch(`/api/sendEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, message, email, phone, company }),
  });
  
  return await response.json();
}