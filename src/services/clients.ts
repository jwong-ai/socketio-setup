import AWS from 'aws-sdk';

// const awsCredentials = new AWS.SharedIniFileCredentials({profile: 'default'});
// AWS.config.credentials = awsCredentials;

// TODO: Set the AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION environment variables
const credentials = new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID!, process.env.AWS_SECRET_ACCESS_KEY!);
AWS.config.credentials = credentials;
AWS.config.update({region: process.env.AWS_REGION});

export const createAWSPinpointClient = (): AWS.Pinpoint => {
	return new AWS.Pinpoint();
};
