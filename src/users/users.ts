import { WorkOS } from '../workos';
import { AutoPaginatable } from '../common/utils/pagination';
import {
  AddUserToOrganizationOptions,
  AuthenticateUserWithCodeOptions,
  AuthenticateUserWithMagicAuthOptions,
  AuthenticateUserWithPasswordOptions,
  AuthenticationResponse,
  AuthenticationResponseResponse,
  CompletePasswordResetOptions,
  CreateEmailVerificationChallengeOptions,
  CreateEmailVerificationChallengeResponse,
  CreateEmailVerificationChallengeResponseResponse,
  CreatePasswordResetChallengeOptions,
  CreatePasswordResetChallengeResponse,
  CreatePasswordResetChallengeResponseResponse,
  CreateUserOptions,
  DeleteUserOptions,
  EnrollUserInMfaFactorOptions,
  ListUsersOptions,
  MagicAuthChallenge,
  RemoveUserFromOrganizationOptions,
  SendMagicAuthCodeOptions,
  SerializedAddUserToOrganizationOptions,
  SerializedAuthenticateUserWithCodeOptions,
  SerializedAuthenticateUserWithMagicAuthOptions,
  SerializedAuthenticateUserWithPasswordOptions,
  SerializedCompletePasswordResetOptions,
  SerializedCreateEmailVerificationChallengeOptions,
  SerializedCreatePasswordResetChallengeOptions,
  SerializedCreateUserOptions,
  SerializedSendMagicAuthCodeOptions,
  SerializedVerifyEmailOptions,
  UpdateUserOptions,
  UpdateUserPasswordOptions,
  User,
  UserResponse,
  VerifyEmailOptions,
} from './interfaces';
import {
  deserializeAuthenticationResponse,
  deserializeCreateEmailVerificationChallengeResponse,
  deserializeCreatePasswordResetChallengeResponse,
  deserializeUser,
  serializeAuthenticateUserWithMagicAuthOptions,
  serializeAuthenticateUserWithPasswordOptions,
  serializeAuthenticateUserWithCodeOptions,
  serializeCompletePasswordResetOptions,
  serializeCreatePasswordResetChallengeOptions,
  serializeCreateUserOptions,
  serializeSendMagicAuthCodeOptions,
  serializeUpdateUserOptions,
  serializeUpdateUserPasswordOptions,
} from './serializers';
import { fetchAndDeserialize } from '../common/utils/fetch-and-deserialize';
import {
  Challenge,
  ChallengeResponse,
  Factor,
  FactorResponse,
} from '../mfa/interfaces';
import { deserializeChallenge, deserializeFactor } from '../mfa/serializers';
import { serializeEnrollUserInMfaFactorOptions } from './serializers/enroll-user-in-mfa-factor-options.serializer';

export class Users {
  constructor(private readonly workos: WorkOS) {}

  async getUser(userId: string): Promise<User> {
    const { data } = await this.workos.get<UserResponse>(`/users/${userId}`);

    return deserializeUser(data);
  }

  async listUsers(options?: ListUsersOptions): Promise<AutoPaginatable<User>> {
    return new AutoPaginatable(
      await fetchAndDeserialize<UserResponse, User>(
        this.workos,
        '/users',
        deserializeUser,
        options,
      ),
      (params) =>
        fetchAndDeserialize<UserResponse, User>(
          this.workos,
          '/users',
          deserializeUser,
          params,
        ),
      options,
    );
  }

  async createUser(payload: CreateUserOptions): Promise<User> {
    const { data } = await this.workos.post<
      UserResponse,
      any,
      SerializedCreateUserOptions
    >('/users', serializeCreateUserOptions(payload));

    return deserializeUser(data);
  }

  async authenticateUserWithMagicAuth(
    payload: AuthenticateUserWithMagicAuthOptions,
  ): Promise<AuthenticationResponse> {
    const { data } = await this.workos.post<
      AuthenticationResponseResponse,
      any,
      SerializedAuthenticateUserWithMagicAuthOptions
    >(
      '/users/sessions/token',
      serializeAuthenticateUserWithMagicAuthOptions({
        ...payload,
        clientSecret: this.workos.key,
      }),
    );

    return deserializeAuthenticationResponse(data);
  }

  async authenticateUserWithPassword(
    payload: AuthenticateUserWithPasswordOptions,
  ): Promise<AuthenticationResponse> {
    const { data } = await this.workos.post<
      AuthenticationResponseResponse,
      any,
      SerializedAuthenticateUserWithPasswordOptions
    >(
      '/users/sessions/token',
      serializeAuthenticateUserWithPasswordOptions({
        ...payload,
        clientSecret: this.workos.key,
      }),
    );

    return deserializeAuthenticationResponse(data);
  }

  async authenticateUserWithCode(
    payload: AuthenticateUserWithCodeOptions,
  ): Promise<AuthenticationResponse> {
    const { data } = await this.workos.post<
      AuthenticationResponseResponse,
      any,
      SerializedAuthenticateUserWithCodeOptions
    >(
      '/users/sessions/token',
      serializeAuthenticateUserWithCodeOptions({
        ...payload,
        clientSecret: this.workos.key,
      }),
    );

    return deserializeAuthenticationResponse(data);
  }

  async createEmailVerificationChallenge({
    userId,
    verificationUrl,
  }: CreateEmailVerificationChallengeOptions): Promise<CreateEmailVerificationChallengeResponse> {
    const { data } = await this.workos.post<
      CreateEmailVerificationChallengeResponseResponse,
      any,
      SerializedCreateEmailVerificationChallengeOptions
    >(`/users/${userId}/email_verification_challenge`, {
      verification_url: verificationUrl,
    });

    return deserializeCreateEmailVerificationChallengeResponse(data);
  }

  async sendMagicAuthCode(
    options: SendMagicAuthCodeOptions,
  ): Promise<MagicAuthChallenge> {
    const { data } = await this.workos.post<
      MagicAuthChallenge,
      any,
      SerializedSendMagicAuthCodeOptions
    >('/users/magic_auth/send', serializeSendMagicAuthCodeOptions(options));

    return data;
  }

  async verifyEmail({ code, userId }: VerifyEmailOptions): Promise<User> {
    const { data } = await this.workos.post<
      UserResponse,
      any,
      SerializedVerifyEmailOptions
    >(`/users/${userId}/verify_email`, {
      code,
    });

    return deserializeUser(data);
  }

  async createPasswordResetChallenge(
    payload: CreatePasswordResetChallengeOptions,
  ): Promise<CreatePasswordResetChallengeResponse> {
    const { data } = await this.workos.post<
      CreatePasswordResetChallengeResponseResponse,
      any,
      SerializedCreatePasswordResetChallengeOptions
    >(
      '/users/password_reset_challenge',
      serializeCreatePasswordResetChallengeOptions(payload),
    );

    return deserializeCreatePasswordResetChallengeResponse(data);
  }

  async completePasswordReset(
    payload: CompletePasswordResetOptions,
  ): Promise<User> {
    const { data } = await this.workos.post<
      UserResponse,
      any,
      SerializedCompletePasswordResetOptions
    >('/users/password_reset', serializeCompletePasswordResetOptions(payload));

    return deserializeUser(data);
  }

  async addUserToOrganization({
    userId,
    organizationId,
  }: AddUserToOrganizationOptions): Promise<User> {
    const { data } = await this.workos.post<
      UserResponse,
      any,
      SerializedAddUserToOrganizationOptions
    >(`/users/${userId}/organizations`, {
      organization_id: organizationId,
    });

    return deserializeUser(data);
  }

  async removeUserFromOrganization({
    userId,
    organizationId,
  }: RemoveUserFromOrganizationOptions): Promise<User> {
    const { data } = await this.workos.delete<UserResponse>(
      `/users/${userId}/organizations/${organizationId}`,
    );

    return deserializeUser(data);
  }

  async updateUser(payload: UpdateUserOptions): Promise<User> {
    const { data } = await this.workos.put<UserResponse>(
      `/users/${payload.userId}`,
      serializeUpdateUserOptions(payload),
    );

    return deserializeUser(data);
  }

  async updateUserPassword(payload: UpdateUserPasswordOptions): Promise<User> {
    const { data } = await this.workos.put<UserResponse>(
      `/users/${payload.userId}/password`,
      serializeUpdateUserPasswordOptions(payload),
    );

    return deserializeUser(data);
  }

  async enrollUserInMfaFactor(payload: EnrollUserInMfaFactorOptions): Promise<{
    authenticationFactor: Factor;
    authenticationChallenge: Challenge;
  }> {
    const { data } = await this.workos.post<{
      authentication_factor: FactorResponse;
      authentication_challenge: ChallengeResponse;
    }>(
      `/users/${payload.userId}/auth/factors`,
      serializeEnrollUserInMfaFactorOptions(payload),
    );

    return {
      authenticationFactor: deserializeFactor(data.authentication_factor),
      authenticationChallenge: deserializeChallenge(
        data.authentication_challenge,
      ),
    };
  }

  async deleteUser(payload: DeleteUserOptions) {
    await this.workos.delete(`/users/${payload.userId}`);
  }
}
