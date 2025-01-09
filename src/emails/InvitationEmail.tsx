import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InvitationEmailProps {
  email: string;
  role: string;
}

export const InvitationEmail = ({ email, role }: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to join CodeLumus! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to CodeLumus!</Heading>
          
          <Text style={text}>
            Hey there!
          </Text>
          
          <Text style={text}>
            I'm Carlos, the founder of CodeLumus. I wanted to personally let you know that I've invited you to join us as a {role.toLowerCase()}. I'm really excited to have you on board!
          </Text>

          <Text style={text}>
            You can sign in right away using with magic link from this email address: <strong>{email}</strong>
          </Text>

          <Text style={text}>
            If you need any help or have questions, just reply to this email - I'm always here to help.
          </Text>

          <Text style={footer}>
            Thanks for joining us!<br />
            Carlos<br />
            Founder @ CodeLumus
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default InvitationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const footer = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "48px 0 0",
  fontStyle: "italic",
}; 