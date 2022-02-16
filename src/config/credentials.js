import dotenv from 'dotenv';

dotenv.config();

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const getCredentials = () => {

    const development = {
        uri: process.env.MONGODB_URI_DEV,
        options: Object.assign(mongooseOptions, {})
    };

    const production = {
        uri: process.env.MONGODB_URI_PROD,
        options: Object.assign(mongooseOptions, {})
    }

    switch (process.env.NODE_ENV){
        case 'development' : 
            return development;

        case 'production' : 
            return production;

        default:
            return development;
    }
    
}

const credentials = getCredentials();

export default credentials;