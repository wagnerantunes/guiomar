module.exports = {
    apps: [{
        name: 'renovamente-cms',
        script: 'npm',
        args: 'start',
        cwd: '/var/www/renovamente-cms',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production',
            PORT: 3001
        }
    }]
}
