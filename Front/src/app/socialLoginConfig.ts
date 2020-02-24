import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider} from 'angular5-social-login';

export function getAuthServiceConfigs() {
  return new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('820402724533-gipgomntbioeak9f9grtnsak2c972488.apps.googleusercontent.com')
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('446331892680239')
    }
  ]);
}
