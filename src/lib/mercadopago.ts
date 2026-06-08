import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const mpPayment = new Payment(client);
export const mpPreference = new Preference(client);

export async function createPixPayment(data: {
  orderId: string;
  amount: number;
  email: string;
  name: string;
  cpf: string;
}) {
  const response = await mpPayment.create({
    body: {
      transaction_amount: data.amount,
      description: `Pedido #${data.orderId}`,
      payment_method_id: "pix",
      payer: {
        email: data.email,
        first_name: data.name.split(" ")[0],
        last_name: data.name.split(" ").slice(1).join(" ") || ".",
        identification: { type: "CPF", number: data.cpf.replace(/\D/g, "") },
      },
      external_reference: data.orderId,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/pagamentos/webhook`,
    },
  });
  return response;
}

export async function createCardPayment(data: {
  orderId: string;
  amount: number;
  email: string;
  name: string;
  cpf: string;
  token: string;
  installments: number;
  paymentMethodId: string;
  issuerId?: string;
}) {
  const response = await mpPayment.create({
    body: {
      transaction_amount: data.amount,
      description: `Pedido #${data.orderId}`,
      payment_method_id: data.paymentMethodId,
      token: data.token,
      installments: data.installments,
      issuer_id: data.issuerId ? parseInt(data.issuerId) : undefined,
      payer: {
        email: data.email,
        first_name: data.name.split(" ")[0],
        last_name: data.name.split(" ").slice(1).join(" ") || ".",
        identification: { type: "CPF", number: data.cpf.replace(/\D/g, "") },
      },
      external_reference: data.orderId,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/pagamentos/webhook`,
    },
  });
  return response;
}

export async function createBoletoPayment(data: {
  orderId: string;
  amount: number;
  email: string;
  name: string;
  cpf: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    cep: string;
  };
}) {
  const response = await mpPayment.create({
    body: {
      transaction_amount: data.amount,
      description: `Pedido #${data.orderId}`,
      payment_method_id: "bolbradesco",
      payer: {
        email: data.email,
        first_name: data.name.split(" ")[0],
        last_name: data.name.split(" ").slice(1).join(" ") || ".",
        identification: { type: "CPF", number: data.cpf.replace(/\D/g, "") },
        address: {
          zip_code: data.address.cep.replace(/\D/g, ""),
          street_name: data.address.street,
          street_number: data.address.number,
          city: data.address.city,
          federal_unit: data.address.state,
        },
      },
      external_reference: data.orderId,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/pagamentos/webhook`,
      date_of_expiration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });
  return response;
}

export async function getPaymentStatus(paymentId: string) {
  return await mpPayment.get({ id: paymentId });
}
