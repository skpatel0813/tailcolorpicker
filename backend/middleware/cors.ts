import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  origin: 'http://localhost:3001', // Replace with your frontend URL
  methods: ['POST', 'GET', 'HEAD'],
  credentials: true,
});

// Helper function to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
export { runMiddleware };
