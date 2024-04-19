import { mkdirSync, writeFileSync } from "fs";

export const genScripts = (str: string) => {
    return `#!/bin/bash
cp /etc/hosts /etc/hosts.bak
echo "hosts 文件已备份为 hosts.bak"
echo "${str}" >> /etc/hosts
echo "修改成功！"`;
};

export const genRecoverScript = () => {
    mkdirSync(process.env.SCRIPT_DIR!, { recursive: true });
    writeFileSync(
        process.env.SCRIPT_DIR! + "/recover.sh",
        `#!/bin/bash

#检查/etc/hosts.bak是否存在，如果存在则恢复/etc/hosts

if [ -f /etc/hosts.bak ]; then
    cp /etc/hosts.bak /etc/hosts
    echo "hosts 文件已恢复"
else
    echo "未发现备份文件，无法恢复"
fi`
    );
};
