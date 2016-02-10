@echo off

if exist "%~dp0node.exe" (
  %~dp0node.exe %~dp0..\lib\index.js %*
) else (
  node.exe %~dp0..\lib\index.js %*
)
