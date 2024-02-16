module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      instances: 3,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      error_file: "./logs/err.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
