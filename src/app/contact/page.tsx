export default function Contact() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col">
        <h2 className="mb-4 mt-8 text-4xl tracking-tight font-extrabold text-center">
          Contact Us
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          Got a technical issue? Want to send feedback about a beta feature?
          Need details about our Business plan? Let us know.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-16 mx-auto">
        <div className="flex flex-col gap-2 items-center">
          <p>Số điện thoại</p>
          <p className="font-semibold">0971578680</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p>Họ tên</p>
          <p className="font-semibold">Hoàng Vũ Nghị</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <p>Gmail</p>
          <p className="font-semibold">hoangvunghi2004@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
