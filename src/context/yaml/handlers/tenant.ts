import { hoursAsInteger, clearTenantFlags } from '../../../utils';
import { YAMLHandler } from '.'
import YAMLContext from '..'

type ParsedTenant = {
  tenant: unknown[]
} | {}

async function parse(context: YAMLContext): Promise<ParsedTenant> {
  // Nothing to do
  if (!context.assets.tenant) return {};

  /* eslint-disable camelcase */
  const {
    session_lifetime,
    idle_session_lifetime,
    ...tenant
  } = context.assets.tenant;

  clearTenantFlags(tenant);

  return {
    tenant: Object.assign(
      tenant,
      session_lifetime && hoursAsInteger('session_lifetime', session_lifetime),
      idle_session_lifetime && hoursAsInteger('idle_session_lifetime', idle_session_lifetime)
    )
  };
  /* eslint-enable camelcase */
}

async function dump(context: YAMLContext): Promise<ParsedTenant> {
  const tenant = { ...context.assets.tenant || {} };

  clearTenantFlags(tenant);

  return { tenant };
}

const tenantHandler: YAMLHandler<ParsedTenant> = {
  parse,
  dump,
};

export default tenantHandler;