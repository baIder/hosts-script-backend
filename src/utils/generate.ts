export const genScripts = (str: string) => {
    const string1 = `
#!/bin/bash

echo "请输入管理员密码以继续："

script_dir=$(dirname "$0")

recover_sh_path="$script_dir/recover.sh"

sudo echo '#!/bin/bash
sudo cp /etc/hosts.bak /etc/hosts
if [ -f /etc/hosts.bak ]; then
    cp /etc/hosts.bak /etc/hosts
    echo "hosts 文件已恢复"
else
    echo "未发现备份文件，无法恢复"
fi
read -rsp $"请按任意键继续..." -n1 key
' > "$recover_sh_path"
    
sudo chmod +x "$recover_sh_path"

echo "已创建recover.sh，可用于恢复hosts文件。" 
    
sudo cp /etc/hosts /etc/hosts.bak
echo "hosts文件已备份为hosts.bak"
    
echo "${str}" | sudo tee -a /etc/hosts
    
echo "hosts文件已修改。"
read -rsp $'请按任意键继续...\\n' -n1 key
`;
    return string1;
};

export const genBatScript = (arr: Hosts[]) => {
    let batScript = `
@echo off
:: BatchGotAdmin
:-------------------------------------
REM --> Check for permissions
>nul 2>&1 "%SYSTEMROOT%\\system32\\cacls.exe" "%SYSTEMROOT%\\system32\\config\\system"

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\\getadmin.vbs"

    "%temp%\\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\\getadmin.vbs" ( del "%temp%\\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------

:: 生成recover.bat以恢复hosts文件
(
echo @echo off
echo :: BatchGotAdmin
echo :-------------------------------------
echo REM --^> Check for permissions
echo ^>nul 2^>^&1 "%%SYSTEMROOT%%\\system32\\cacls.exe" "%%SYSTEMROOT%%\\system32\\config\\system"
echo REM --^> If error flag set, we do not have admin.
echo if '%%errorlevel%%' NEQ '0' ^(
echo     echo Requesting administrative privileges...
echo     goto UACPrompt
echo ^) else ^( goto gotAdmin ^)
echo :UACPrompt
echo    echo Set UAC = CreateObject^("Shell.Application"^) ^> "%%temp%%\\getadmin.vbs"
echo    echo UAC.ShellExecute "%%~s0", "", "", "runas", 1 ^>^> "%%temp%%\\getadmin.vbs"
echo     "%temp%\\getadmin.vbs"
echo     exit /B
echo :gotAdmin
echo     if exist "%%temp%%\\getadmin.vbs" ^( del "%%temp%%\\getadmin.vbs" ^)
echo     pushd "%%CD%%"
echo     CD /D "%%~dp0"
echo :--------------------------------------
echo copy /y %SYSTEMROOT%\\System32\\drivers\\etc\\hosts.bak %SYSTEMROOT%\\System32\\drivers\\etc\\hosts
echo echo hosts has been recovered.
echo pause
) > recover.bat

echo Recover.bat has been created, you can run it to recover hosts file.

copy "%SYSTEMROOT%\\System32\\drivers\\etc\\hosts" "%SYSTEMROOT%\\System32\\drivers\\etc\\hosts.bak"
echo File hosts has been backed up to hosts.bak.
    `;
    arr.forEach((host) => {
        batScript += `echo ${host.ip} ${host.domain} >> "%SYSTEMROOT%\\System32\\drivers\\etc\\hosts"\n`;
    });

    batScript += `
echo Update completed.
pause
    `;
    return batScript.replace(/\n/g, "\r\n");
};
