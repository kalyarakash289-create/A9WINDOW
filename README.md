# A9 OPTIMIZER

**Professional Windows PC Optimization & Diagnostics**

A9 Optimizer is a production-grade Windows 10/11 x64 desktop application for system optimization, diagnostics, performance monitoring, cleanup, and maintenance.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11%20x64-blue)
![License](https://img.shields.io/badge/license-Proprietary-green)

## Features

### Core Features
- **Real-time Dashboard** - CPU, RAM, GPU, disk, network monitoring
- **System Optimizer** - Scan and optimize with safe, reversible actions
- **Performance Monitor** - Live charts with historical data
- **Process Manager** - View and manage running processes
- **Startup Manager** - Control startup applications
- **Storage Analyzer** - Disk usage analysis and visualization
- **Cleanup Engine** - Safe temporary file and cache removal
- **Privacy Tools** - Clear traces and manage privacy settings
- **Network Diagnostics** - Ping, DNS, IP configuration tools
- **Hardware Center** - Complete system hardware information
- **Driver Center** - View installed driver information
- **Windows Tools** - Quick access to built-in Windows utilities
- **AI Assistant** - Intelligent PC help with privacy protection
- **Reports** - Generate and export system reports
- **System Tray** - Background monitoring with quick actions

### Security Features
- Context isolation enabled
- No node integration in renderer
- Secure IPC with input validation
- API keys stored in Windows Credential Manager
- No arbitrary command execution
- Whitelist-based subprocess spawning
- Content Security Policy enforced

## Requirements

- **OS**: Windows 10/11 64-bit
- **RAM**: 4 GB minimum
- **Disk**: 200 MB free space
- **Node.js**: 20.x (for development)
- **npm**: 10.x

## Installation

### From Installer
1. Download `A9-Optimizer-Setup-x64.exe`
2. Run the installer
3. Follow the installation wizard
4. Launch A9 Optimizer

### From Source (Development)
```bash
# Clone the repository
git clone https://github.com/a9/optimizer.git
cd optimizer

# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run build

# Package Windows installer
npm run package
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build production web assets |
| `npm run package` | Create Windows installer |
| `npm run lint` | Run linter |
| `npm run test` | Run tests |
| `npm run typecheck` | TypeScript type checking |

## Output

After packaging:
```
release/
├── A9-Optimizer-Setup-1.0.0-x64.exe    # NSIS installer
├── A9-Optimizer-1.0.0-x64-portable.exe # Portable build (if configured)
└── win-unpacked/                        # Unpacked application
```

## Architecture

```
A9-Optimizer/
├── electron/           # Electron main process
│   ├── main.ts        # App entry point
│   ├── ipc/           # IPC handlers
│   ├── services/      # Business logic services
│   └── security/      # Security utilities
├── preload/           # Secure preload scripts
├── src/               # React renderer
│   ├── components/    # Reusable UI components
│   ├── pages/         # Application pages
│   ├── lib/           # Utilities and bridge
│   ├── stores/        # State management
│   ├── types/         # TypeScript types
│   └── locales/       # Internationalization
├── native/            # Native helpers
│   └── powershell/    # PowerShell scripts
├── assets/            # Icons, images
├── docs/              # Documentation
└── tests/             # Test suites
```

## Security

See [SECURITY.md](./SECURITY.md) for detailed security information.

Key security measures:
- Context isolation prevents renderer access to Node.js
- All IPC communication is validated and typed
- Subprocess execution uses argument arrays (no shell injection)
- API keys encrypted via Windows Credential Manager
- No telemetry without explicit user consent
- Content Security Policy restricts resource loading

## AI Configuration

A9 Optimizer supports multiple AI providers for the AI Assistant:
- DeepSeek
- Grok
- Groq
- OpenRouter

API keys are configured in Settings > AI Configuration and stored securely.
The application automatically routes to the first available configured provider.

## Troubleshooting

### Application won't start
- Ensure Windows 10/11 x64
- Check Windows Defender isn't blocking the executable
- Run as Administrator if specific features require elevation

### Features showing "Unavailable"
- Some hardware sensors require specific drivers
- Temperature monitoring needs compatible hardware
- Some operations require Administrator privileges

### AI Assistant not working
- Verify API key is configured in Settings
- Check internet connection
- Test connection using the "Test" button

## Known Limitations

- GPU temperature requires specific driver support
- Some cleanup operations require Administrator privileges
- AI features require internet connection and API key
- Windows Store apps cannot be managed via startup manager
- Some system operations trigger UAC prompts

## License

Proprietary. © 2024 A9. All rights reserved.

## Support

- Documentation: [docs/](./docs/)
- Issues: GitHub Issues
- Email: support@a9optimizer.com
