/**
 * Environment variables validation and helpers
 * Provides type-safe access to environment variables with clear error messages
 */

type EnvVarConfig = {
  key: string;
  required: boolean;
  description: string;
  defaultValue?: string;
};

const ENV_VARS: Record<string, EnvVarConfig> = {
  // Shopify Configuration
  SHOPIFY_STORE_DOMAIN: {
    key: 'SHOPIFY_STORE_DOMAIN',
    required: true,
    description: 'Your Shopify store domain (e.g., your-store.myshopify.com)',
  },
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: {
    key: 'SHOPIFY_STOREFRONT_ACCESS_TOKEN',
    required: true,
    description: 'Shopify Storefront API access token for product catalog access',
  },
  SHOPIFY_ADMIN_API_TOKEN: {
    key: 'SHOPIFY_ADMIN_API_TOKEN',
    required: false,
    description: 'Shopify Admin API token for advanced operations (optional)',
  },
  
  // AI Configuration
  OPENAI_API_KEY: {
    key: 'OPENAI_API_KEY',
    required: false,
    description: 'OpenAI API key for AI chat functionality (optional)',
  },
};

type EnvValidationResult = {
  isValid: boolean;
  missing: string[];
  errors: string[];
  warnings: string[];
};

/**
 * Validates environment variables and returns detailed results
 */
export function validateEnvironment(): EnvValidationResult {
  const missing: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  Object.values(ENV_VARS).forEach((config) => {
    const value = process.env[config.key];
    
    if (!value || value.trim() === '') {
      if (config.required) {
        missing.push(config.key);
        errors.push(`Missing required environment variable: ${config.key}`);
        errors.push(`  Description: ${config.description}`);
      } else {
        warnings.push(`Optional environment variable not set: ${config.key}`);
        warnings.push(`  Description: ${config.description}`);
      }
    }
  });

  const isValid = missing.length === 0;

  return {
    isValid,
    missing,
    errors,
    warnings,
  };
}

/**
 * Gets an environment variable with optional default value
 */
export function getEnvVar(key: keyof typeof ENV_VARS, defaultValue?: string): string | undefined {
  const value = process.env[ENV_VARS[key].key];
  return value || defaultValue || ENV_VARS[key].defaultValue;
}

/**
 * Checks if a specific feature is enabled based on environment configuration
 */
export function isFeatureEnabled(feature: 'shopify' | 'ai_chat'): boolean {
  switch (feature) {
    case 'shopify':
      return !!(getEnvVar('SHOPIFY_STORE_DOMAIN') && getEnvVar('SHOPIFY_STOREFRONT_ACCESS_TOKEN'));
    case 'ai_chat':
      return !!getEnvVar('OPENAI_API_KEY');
    default:
      return false;
  }
}

/**
 * Generates setup instructions for missing environment variables
 */
export function generateSetupInstructions(validationResult: EnvValidationResult): string {
  if (validationResult.isValid) {
    return 'All required environment variables are configured correctly.';
  }

  const instructions = [
    '🔧 Environment Setup Required',
    '',
    'Create a file called .env.local in the apps/web directory with the following variables:',
    '',
  ];

  validationResult.missing.forEach((key) => {
    const config = Object.values(ENV_VARS).find(c => c.key === key);
    if (config) {
      instructions.push(`# ${config.description}`);
      instructions.push(`${key}=your_${key.toLowerCase()}_here`);
      instructions.push('');
    }
  });

  instructions.push('📚 Setup Guide:');
  instructions.push('1. Shopify: https://shopify.dev/docs/api/storefront');
  instructions.push('2. OpenAI: https://platform.openai.com/api-keys');
  instructions.push('');
  instructions.push('⚠️  Restart the development server after adding environment variables.');

  return instructions.join('\n');
}

/**
 * Logs environment status to console (development only)
 */
export function logEnvironmentStatus(): void {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const validation = validateEnvironment();
  
  if (validation.isValid) {
    console.log('✅ Environment variables configured correctly');
  } else {
    console.warn('⚠️  Environment configuration issues detected:');
    validation.errors.forEach(error => console.warn(`   ${error}`));
    console.log('');
    console.log(generateSetupInstructions(validation));
  }

  if (validation.warnings.length > 0) {
    console.info('ℹ️  Optional features not configured:');
    validation.warnings.forEach(warning => console.info(`   ${warning}`));
  }
}
