# 📊 Importação de Perguntas via Excel - Wiki OSL

## 🎯 Funcionalidade

A área administrativa da Wiki agora permite importar perguntas e respostas em massa através de planilhas Excel (.xlsx, .xls) ou CSV.

## 📋 Estrutura da Planilha

Sua planilha deve ter as seguintes colunas na **primeira aba**:

| Coluna | Nome Aceito | Descrição |
|--------|-------------|-----------|
| A | `Pergunta` / `pergunta` / `Question` | Texto da pergunta |
| B | `Resposta` / `resposta` / `Answer` | Texto da resposta |
| C | `Categoria` / `categoria` / `Category` | Categoria da pergunta (opcional) |

### Exemplo:

| Pergunta | Resposta | Categoria |
|----------|----------|-----------|
| O que é CBS? | CBS é a Contribuição sobre Bens e Serviços... | Reforma Tributária |
| Como funciona o PIX? | O PIX é um sistema de pagamento... | PIX |

## 🔗 Planilha de Referência

Use esta planilha como modelo:
[Planilha Google Drive](https://docs.google.com/spreadsheets/d/10hMhLJaXE30utQZDiPlcLSqwsV0I2fZCeCKAUrOrr-E/edit?usp=drive_link)

## 📥 Como Importar

### Passo 1: Preparar a planilha
1. Crie sua planilha com as colunas: Pergunta, Resposta, Categoria
2. Preencha os dados
3. Salve como `.xlsx`, `.xls` ou `.csv`

### Passo 2: Acessar a área administrativa
1. Vá para `#/admin`
2. Faça login com a senha: `osl2026`

### Passo 3: Importar
1. Clique no botão **"Importar do Excel"**
2. Arraste o arquivo ou clique para selecionar
3. Revise o preview dos dados
4. Escolha o modo:
   - **Adicionar**: Mantém as perguntas existentes e adiciona as novas
   - **Substituir**: Remove todas e importa apenas as da planilha
5. Clique em **"Importar"**

### Passo 4: Confirmar
- O sistema valida os dados
- Mostra quantos itens estão válidos e com erro
- Confirma a importação

## 📤 Exportar para Excel

Você também pode exportar todas as perguntas existentes:

1. Na área administrativa, clique em **"Exportar para Excel"**
2. O arquivo será baixado automaticamente
3. Use como backup ou para editar em massa

## 📝 Template de Exemplo

O sistema oferece um template para download com exemplos prontos. Clique em **"Baixar template de exemplo"** na tela de importação.

## ⚠️ Validações

O sistema verifica automaticamente:
- ✅ Pergunta não pode estar em branco
- ✅ Resposta não pode estar em branco
- ✅ Categoria é opcional (padrão: "Geral")
- ✅ Linhas inválidas são marcadas e não são importadas

## 💡 Dicas

- **Flexibilidade de nomes**: O sistema aceita diferentes variações dos nomes das colunas (maiúsculas, minúsculas, português, inglês)
- **Preview antes de importar**: Sempre revise o preview antes de confirmar
- **Backup**: Exporte seus dados antes de fazer alterações em massa
- **Modo Adicionar vs Substituir**: 
  - Use **Adicionar** para incluir novas perguntas
  - Use **Substituir** apenas se quiser limpar tudo e começar do zero

## 🐛 Solução de Problemas

### "A planilha está vazia"
- Verifique se os dados estão na primeira aba
- Confirme que as colunas estão nomeadas corretamente

### "Nenhum item válido encontrado"
- Verifique se há pelo menos uma linha com Pergunta e Resposta preenchidas
- Confirme que a primeira linha contém os cabeçalhos

### "Erro ao ler o arquivo"
- Verifique se o arquivo é realmente Excel (.xlsx, .xls) ou CSV
- Tente salvar novamente em um formato compatível

## 📞 Suporte

Se tiver dúvidas ou problemas, entre em contato:
- E-mail: fiscal@osl.com.br
- WhatsApp: (35) 98871-1176

---

**OSL Contadores Associados** - Sistema de Wiki com Importação em Massa
