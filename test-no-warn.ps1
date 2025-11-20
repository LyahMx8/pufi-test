# Script PowerShell para ejecutar tests sin warnings de deprecación
$env:NODE_OPTIONS = "--no-deprecation"
npm run ng -- test

