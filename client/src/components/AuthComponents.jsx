import { Link } from "react-router";
import { Button, Form } from "react-bootstrap";
import { useActionState } from "react";

function LoginForm(props) {
  const [state, formAction, isPending] = useActionState(loginFunction, {
    username: "",
    password: "",
  });

  async function loginFunction(prevState, formData) {
    const credentials = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      await props.handleLogin(credentials);
      return { success: true };
    } catch (error) {
      return { error: "Login failed. Check your credentials." };
    }
  }

  return (
    <>
      <Form action={formAction}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter username"
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
          />
        </Form.Group>
        <Button type="submit">Login</Button>
      </Form>
    </>
  );
}

export { LoginForm };
