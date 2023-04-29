export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  //   if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
  //     return res.status(401).json({ message: 'Invalid token' });
  //   }

  const address = req.body.address;

  try {
    await res.revalidate(`/campaigns/${address}`);

    return res.json({ revalidated: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error revalidating');
  }
}
