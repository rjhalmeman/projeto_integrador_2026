#!/bin/bash

# Define a data e hora atual no formato YYYY-MM-DD HH:MM
DATA_HORA=$(date +"%Y-%m-%d %H:%M")

# Verifica se um argumento ($1) foi passado.
if [ -z "$1" ]; then
    # Se NENHUM argumento foi passado, usa uma mensagem padrão.
    MENSAGEM_ADICIONAL="Commit automático"
else
    # Se um argumento FOI passado, usa ele como mensagem adicional.
    MENSAGEM_ADICIONAL="$1"
fi

# Cria a mensagem de commit final
COMMIT_MESSAGE="[${DATA_HORA}] ${MENSAGEM_ADICIONAL}"

echo "Iniciando o processo de Git..."
echo "Mensagem de Commit: ${COMMIT_MESSAGE}"
echo "-----------------------------------"

# 1. Adiciona todos os arquivos modificados
git add .
if [ $? -ne 0 ]; then
    echo "Erro ao executar 'git add .' - abortando."
    exit 1
fi

# 2. Faz o commit com a mensagem formatada
git commit -m "${COMMIT_MESSAGE}"
if [ $? -ne 0 ]; then
    echo "Atenção: Nenhum arquivo para commit ou erro no 'git commit' - prosseguindo para o push, se houver commits pendentes."
    # Não saímos aqui, pois podemos querer dar um push em um commit anterior não enviado
fi

# 3. Faz o push
git push
if [ $? -ne 0 ]; then
    echo "Erro ao executar 'git push'."
    exit 1
fi

echo "-----------------------------------"
echo "Processo Git concluído com sucesso!"
