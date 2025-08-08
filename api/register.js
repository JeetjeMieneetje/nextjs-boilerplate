import Airtable from 'airtable';
import { authenticator } from 'otplib';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('your_base_id');

export default async function handler(req, res) {
  // Haal gebruikersnaam en e-mail op uit het verzoek
  const { username, email } = req.body;

  // Genereer een unieke TOTP secret voor deze gebruiker
  const secret = authenticator.generateSecret();

  // Sla de gebruiker met secret op in Airtable
  await base('Users').create([{ fields: { username, email, totpSecret: secret } }]);

  // Maak de otpauth URL (voor QR-code)
  const otpauth = authenticator.keyuri(email, 'OriginRoastApp', secret);

  // Stuur de data terug naar de frontend
  res.status(200).json({ username, secret, otpauth });
}
