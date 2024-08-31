export default () => ({
    port: parseInt(process.env.APP_PORT, 10) || 8443,
    timeout: parseInt(process.env.APP_TIMEOUT, 10) || 5000,
    localstack: {
      endpoint: process.env.LOCALSTACK_ENDPOINT,
      region: process.env.LOCALSTACK_REGION
    }
  });
