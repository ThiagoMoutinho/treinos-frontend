## Componentes

- Use componentes da biblioteca shadcn/ui o máximo possível ao criar/modificar componentes
  (veja https://ui.shadcn.com/ para a lista de componentes disponíveis).
- Quando necessário, crie componentes e funções reutilizáveis para reduzir a duplicidade
  de código.
- Antes de criar um novo componente, **SEMPRE** use Context7 para verificar se já existe
  um componente do shadcn/ui que possa ser utilizado. Caso exista, instale-o com
  `pnpm dlx shadcn@latest add <componente>`.
- **NUNCA** crie mais de um componente no mesmo arquivo. Cada componente deve ficar em
  seu próprio arquivo, nomeado em kebab-case (ex.: `workout-day-card.tsx`).

## Formulários

- **SEMPRE** use Zod para validação de formulários.
- **SEMPRE** use React Hook Form para criação e validação de formulários.
- **SEMPRE** use o componente `@/components/ui/form.tsx` para criar formulários. Se ele
  ainda não existir, instale-o com `pnpm dlx shadcn@latest add form`.

Exemplo de formulário:

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Estilização

- **NUNCA** use cores hard-coded do Tailwind (ex.: `bg-blue-500`, `text-gray-700`),
  mas **SEMPRE** as cores do tema definidas em `@/app/globals.css`
  (ex.: `bg-primary`, `text-muted-foreground`).
- Antes de criar uma nova variável de cor, **SEMPRE** consulte a documentação de theming
  do shadcn/ui (https://ui.shadcn.com/docs/theming) e confirme se ela é realmente necessária.
- **SEMPRE** verifique os componentes em `@/components/ui/` que podem ser reutilizados
  na construção de uma página.

## Imagens

- **SEMPRE** use o componente `Image` de `next/image` para renderizar imagens.
