# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

### How to Report

1. **Do not** open a public issue
2. Email security concerns to: [security@example.com](mailto:security@example.com)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- Acknowledgment within 48 hours
- Initial assessment within 1 week
- Regular updates on progress
- Credit in the release notes (unless you prefer anonymity)

## Security Considerations

### WebGL Shaders

This project uses WebGL shaders which:
- Run in a sandboxed environment
- Cannot access the file system
- Are limited by browser security policies

However, malformed shaders could potentially:
- Cause GPU hangs (denial of service)
- Consume excessive resources
- Trigger browser bugs

### Data Files

CSV and JSON data files are:
- Static assets (no server-side processing)
- Validated on load
- Sanitized before display

### Dependencies

We regularly monitor dependencies for vulnerabilities:
- `npm audit` runs in CI
- Dependabot alerts enabled
- Automated security updates

## Best Practices for Users

1. **Keep dependencies updated**
   ```bash
   npm update
   ```

2. **Run security audit**
   ```bash
   npm audit
   ```

3. **Use Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-eval';
                  style-src 'self' 'unsafe-inline';
                  connect-src 'self';
                  img-src 'self' blob:;
                  media-src 'self';
                  worker-src 'self' blob:;">
   ```

4. **Validate user inputs** if extending the project

## Known Limitations

1. **GPU Fingerprinting**: WebGL can be used for device fingerprinting
2. **Resource Exhaustion**: Complex shaders may crash weak GPUs
3. **Browser Bugs**: Shader compilation may trigger browser-specific issues

## Security Updates

Security patches will be released as:
- Patch versions (e.g., 1.2.1) for critical fixes
- Minor versions (e.g., 1.3.0) for non-critical improvements

Subscribe to releases for notifications.

## Acknowledgments

We thank the following security researchers:

- [Your name here] - First security report

---

This security policy is adapted from the [GitHub Security Policy template](https://github.com/github/security-policy-template).
