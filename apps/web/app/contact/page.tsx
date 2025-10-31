export default function ContactPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4">
        We would love to hear from you! Please fill out the form below to get in touch with our team.
      </p>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input type="text" id="name" className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input type="email" id="email" className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block mb-2">Message</label>
          <textarea id="message" className="w-full p-2 border rounded" rows={5}></textarea>
        </div>
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
