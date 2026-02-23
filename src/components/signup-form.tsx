import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>创建账号</CardTitle>
        <CardDescription>
          输入相关信息以进行注册
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">用户名</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="请输入用户名"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">密码</FieldLabel>
              <Input id="password" type="password" required />
              <FieldDescription>
                密码长度至少为8位，且同时包含大写字母、小写字母、数字和特殊字符
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                密码确认
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
              <FieldDescription>请在此输入你的密码</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">注册</Button>
                <FieldDescription className="px-6 text-center">
                  已有账号? <a href="#">登录</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
