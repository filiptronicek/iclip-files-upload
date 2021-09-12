const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto max-w-screen-lg h-full">
        <div className="flex flex-col items-center justify-center">
          <p className="text-white text-center text-sm">
            Made with{" "}
            <span role="img" aria-label="heart">
              ❤️
            </span>{" "}
            by{" "}
            <a
              href="https://github.com/filiptronicek"
              target="_blank"
              rel="noopener noreferrer"
            >
              @filiptronicek
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
