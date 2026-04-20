# Flujo de trabajo con GitHub Pages

## Primera vez

Abre esta carpeta en VS Code:

```text
Portafolio-UX-UX

```

Luego crea un repositorio en GitHub y conecta el remoto:

```bash
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

## Después de editar

Cada vez que cambies algo:

```bash
git status
git add .
git commit -m "Actualiza portafolio"
git push
```

GitHub Pages se actualizará solo después del push. A veces tarda uno o dos minutos.

## Configuración de Pages

En GitHub usa:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

