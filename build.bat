@echo off

cd "%~dp0"

call npx tsc || exit /b %errorlevel%
call npx esbuild src\index.ts --bundle=true --minify=true --platform=node --format=iife --loader:.txt=text --outfile=dist\random-voronoi.js || exit /b %errorlevel%

for /f "usebackq delims=" %%a in (`where node`) DO (set "NODE_PATH=%%~a")

if "%NODE_PATH%"=="" (
  echo "can't find node.exe in PATH"
  exit /b 1
)

copy /y "%NODE_PATH%" "dist\random-voronoi.exe" || exit /b %errorlevel%
call node --experimental-sea-config sea.json || exit /b %errorlevel%
call npx postject dist\random-voronoi.exe NODE_SEA_BLOB dist\random-voronoi.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 || exit /b %errorlevel%
del dist\random-voronoi.blob
