# Clear all caches
npm cache clean --force
rmdir -Force -Recurse C:\Users\TomiLindroos\AppData\Local\npm-cache
rmdir -Force -Recurse C:\Projects\Capitalize\node_modules
rm -Force -Recurse C:\Projects\Capitalize\package-lock.json
rmdir -Force -Recurse $env:LOCALAPPDATA\Temp\metro-cache
rmdir -Force -Recurse $env:LOCALAPPDATA\Temp\haste-map-*
rmdir -Force -Recurse C:\Projects\Capitalize\.expo
rmdir -Force -Recurse $env:USERPROFILE\.expo