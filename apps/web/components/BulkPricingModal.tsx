'use client';

import * as Dialog from '@radix-ui/react-dialog';

export function BulkPricingModal({ whatsappNumber }: { whatsappNumber: string }) {
  const email = 'sales@forestalmt.com';
  const subject = 'Bulk Pricing Inquiry';
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('I would like to inquire about bulk pricing.')}`;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded">Request Bulk Pricing</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            Request Bulk Pricing
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
            For bulk pricing inquiries, please contact us via email or WhatsApp.
          </Dialog.Description>
          <div className="flex flex-col gap-4">
            <a href={mailtoLink} className="bg-primary text-primary-foreground px-4 py-2 rounded text-center">Email Us</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-4 py-2 rounded text-center">WhatsApp Us</a>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              X
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
