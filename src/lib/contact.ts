// Centralized contact info for Glass Maind
export const CONTACT = {
  phone: "5585986067012", // E.164 format for wa.me
  phoneDisplay: "+55 85 98606-7012",
  email: "agenciaglassmaind@gmail.com",
  address: "Av. Des. Moreira, 1300 - Aldeota, Fortaleza - CE, 60170-002",
  instagram: {
    handle: "@glassmainnd",
    url: "https://www.instagram.com/glassmainnd?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  facebook: {
    name: "Agência Glass Maind",
    url: "https://www.facebook.com/share/1DmDotJ1Cg/?mibextid=wwXIfr",
  },
  google: {
    name: "Agência Glass Maind",
    url: "https://share.google/ix4SAr225LHEKESAS",
  },
} as const;

export const whatsappLink = (message?: string) => {
  const base = `https://wa.me/${CONTACT.phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const mailtoLink = (subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return `mailto:${CONTACT.email}${qs ? `?${qs}` : ""}`;
};
