// noinspection JSCheckFunctionSignatures
import {DecomposedJwt} from 'aws-jwt-verify/jwt';

const {CognitoJwtVerifier} = require('aws-jwt-verify');
const {decomposeUnverifiedJwt} = require('aws-jwt-verify/jwt');


// TODO: Set the AWS_COGNITO_USER_POOL_ID and AWS_COGNITO_CLIENT_ID environment variables
const verifier = CognitoJwtVerifier.create({
	userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
	tokenUse: 'id',
	clientId: process.env.AWS_COGNITO_CLIENT_ID,
});


/**
 * @function verifyIdToken
 * @description Verifies an AWS Cognito ID Token
 * @version ES6
 * @param {String} idToken
 * @returns {Promise<any | false>}
 */
export const verifyIdToken = async (idToken: string): Promise<DecomposedJwt | false> => {
	try {
		await verifier.verify(idToken);
		return await decomposeUnverifiedJwt(idToken);
	} catch (error) {
		console.log(error);
		return false;
	}
};
