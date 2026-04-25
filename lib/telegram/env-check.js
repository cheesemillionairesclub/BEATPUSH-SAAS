// Environment validation — Check which API integrations are configured
// Returns a diagnostic report of all required env vars

export function checkEnvironment() {
  const checks = {
    meta: {
      label: 'Meta Ads API',
      vars: {
        META_ADS_ACCESS_TOKEN: { required: true, hint: 'Long-lived access token (60j) — developers.facebook.com > Tools > Get Token' },
        META_ADS_ACCOUNT_ID: { required: true, hint: 'Format: act_XXXXXXXXX — visible dans Ads Manager URL' },
        META_ADS_PAGE_ID: { required: false, hint: 'ID de la Page Facebook (pour créer des ads)' },
        META_ADS_PIXEL_ID: { required: false, hint: 'ID du Pixel Meta — trouvable dans Events Manager' },
      },
    },
    google: {
      label: 'Google Ads API',
      vars: {
        GOOGLE_ADS_DEVELOPER_TOKEN: { required: true, hint: 'MCC > API Center > Developer Token' },
        GOOGLE_ADS_CLIENT_ID: { required: true, hint: 'Google Cloud Console > OAuth 2.0 Client ID' },
        GOOGLE_ADS_CLIENT_SECRET: { required: true, hint: 'Google Cloud Console > OAuth 2.0 Client Secret' },
        GOOGLE_ADS_REFRESH_TOKEN: { required: true, hint: 'Obtenu via OAuth playground ou script' },
        GOOGLE_ADS_CUSTOMER_ID: { required: true, hint: 'ID client sans tirets (ex: 1234567890)' },
        GOOGLE_ADS_MCC_ID: { required: false, hint: 'ID Manager Account (si tu utilises un MCC)' },
      },
    },
    telegram: {
      label: 'Telegram Bot',
      vars: {
        TELEGRAM_BOT_TOKEN: { required: true, hint: 'Créé via @BotFather sur Telegram' },
        TELEGRAM_CHAT_ID: { required: true, hint: 'ID du chat/channel — utilise @userinfobot ou getUpdates' },
      },
    },
    supabase: {
      label: 'Supabase',
      vars: {
        SUPABASE_SERVICE_ROLE_KEY: { required: true, hint: 'Supabase Dashboard > Settings > API > service_role' },
      },
    },
    ga4: {
      label: 'Google Analytics 4',
      vars: {
        GA4_PROPERTY_ID: { required: true, hint: 'GA4 Property ID (ex: 123456789) — analytics.google.com > Admin > Property Settings' },
        GA4_CLIENT_EMAIL: { required: true, hint: 'Service account email — Google Cloud Console > IAM > Service Accounts' },
        GA4_PRIVATE_KEY: { required: true, hint: 'Service account private key (PEM) — téléchargé en JSON lors de la création' },
      },
    },
    claude: {
      label: 'Claude AI (analyse)',
      vars: {
        ANTHROPIC_API_KEY: { required: false, hint: 'console.anthropic.com > API Keys (optionnel, fallback sans IA)' },
      },
    },
    cron: {
      label: 'Cron / Sécurité',
      vars: {
        CRON_SECRET: { required: false, hint: 'Secret pour protéger le endpoint daily-report' },
      },
    },
  };

  const results = {};
  let allOk = true;

  for (const [key, section] of Object.entries(checks)) {
    const vars = {};
    let sectionOk = true;

    for (const [varName, config] of Object.entries(section.vars)) {
      const value = process.env[varName];
      const isSet = !!value;
      const masked = isSet ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : null;

      vars[varName] = {
        set: isSet,
        masked,
        required: config.required,
        hint: config.hint,
      };

      if (config.required && !isSet) {
        sectionOk = false;
        allOk = false;
      }
    }

    results[key] = {
      label: section.label,
      configured: sectionOk,
      vars,
    };
  }

  return { allOk, results };
}

// Build a Telegram-formatted diagnostic message
export function buildEnvCheckMessage() {
  const { allOk, results } = checkEnvironment();

  let msg = `🔧 <b>DIAGNOSTIC CONNEXIONS</b>\n\n`;

  if (allOk) {
    msg += `✅ Toutes les intégrations requises sont configurées !\n\n`;
  } else {
    msg += `⚠️ Certaines intégrations ne sont pas encore configurées.\n\n`;
  }

  for (const [, section] of Object.entries(results)) {
    const icon = section.configured ? '✅' : '❌';
    msg += `${icon} <b>${section.label}</b>\n`;

    for (const [varName, info] of Object.entries(section.vars)) {
      const status = info.set ? '🟢' : (info.required ? '🔴' : '⚪');
      const value = info.set ? info.masked : `<i>${info.hint}</i>`;
      msg += `   ${status} ${varName}: ${value}\n`;
    }
    msg += `\n`;
  }

  msg += `\n💡 Configure les variables dans Vercel Dashboard > Settings > Environment Variables`;

  return msg;
}
