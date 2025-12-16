# 📝 Git Commits - Monsan

## 🎯 Commits Recomendados (Estilo Orgânico)

Para um projeto de portfólio, commits claros e diretos mostram profissionalismo sem ser excessivamente formal.

```bash
# 1. Organização inicial
git add .
git commit -m "Organize project structure and clean up documentation"

# 2. Correções de código
git add src/
git commit -m "Fix TypeScript errors and Svelte warnings"

# 3. Refinamentos
git add src/lib/
git commit -m "Refactor lib structure with proper folders (components, types, utils)"

# 4. Documentação
git add *.md .gitignore
git commit -m "Update documentation and project README"
```

## 🎨 Ou Commit Único (Recomendado)

Se preferir um commit mais direto:

```bash
git add .
git commit -m "Refactor project structure and fix TypeScript errors"
```

## 💡 Dicas para Commits

### ✅ Bons Commits

- **Claros**: Descrevem exatamente o que mudou
- **Específicos**: Focam em uma mudança lógica
- **Imperativos**: "Add", "Fix", "Refactor", "Update"
- **Concisos**: Não precisam ser longos

### Exemplos

```bash
git commit -m "Add user authentication with Supabase"
git commit -m "Fix mobile layout on dashboard"
git commit -m "Refactor component structure"
git commit -m "Update setup documentation"
```

### ❌ Evite

```bash
git commit -m "updates"
git commit -m "fix stuff"
git commit -m "wip"
git commit -m "final (really) (final v2)"
```

## 🎯 Para Este Momento

Após toda a refatoração e organização que fizemos:

```bash
git add .
git commit -m "Reorganize project structure with proper folder hierarchy and fix all TypeScript/Svelte errors"
```

Ou de forma mais detalhada:

```bash
git add .
git commit -m "Refactor project structure

- Organize lib/ into components/, types/, stores/, utils/
- Fix all TypeScript strict mode errors
- Resolve Svelte 5 runes warnings
- Update imports to use centralized lib/index.ts
- Simplify documentation structure
- Update README with current project state"
```

---

**A escolha é sua!** Ambos os estilos são profissionais quando bem executados.
