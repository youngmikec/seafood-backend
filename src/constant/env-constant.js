import dotenv from 'dotenv';
dotenv.config();

const getConstants = () => {
    const development = {
        uri: process.env.APP_URL_DEV
    }

    const test = {
        uri: process.env.APP_URL_DEV
    }

    const production = {
        uri: process.env.APP_URL_PROD
    }

    switch (process.env.NODE_ENV){
        case 'development':
            return development;
        
        case 'test':
            return test;
        
        case 'production':
            return production;
        
        default:
            return production;
    }
}

const APP = getConstants();

export default APP;