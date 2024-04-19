export const genScripts = (str: string) => {
    return `#!/bin/bash
cp /etc/hosts /etc/hosts.bak
echo "hosts 文件已备份为 hosts.bak"
echo "${str}" >> /etc/hosts
echo "修改成功！"`;
};
