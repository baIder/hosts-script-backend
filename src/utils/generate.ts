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
