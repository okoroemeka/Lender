// Type definitions for passport-google-oauth2 0.2
// Project: https://github.com/mstade/passport-google-oauth2
// Definitions by: okoroemeka <https://github.com/okoroemeka>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export = passport_google_oauth2;

declare class passport_google_oauth2 {
    constructor(options: any, verify: any);

    authenticate(req: any, options: any): void;

    authorizationParams(options: any): any;

    userProfile(accessToken: any, done: any): any;

    static Strategy: any;

}

