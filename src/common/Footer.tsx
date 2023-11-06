import Logo from "./Logo";

export default function Footer() {
  const Links = [
    {
      text: "Downloads",
      url: "/downloads",
    },
    {
      text: "Team",
      url: "/team",
    },
  ];

  return (
    <footer>
      <a href="/">
        <div className="footer__copyright">
          <Logo fill="gray" width={80} />© HTS 2023. All rights reserved.
        </div>
      </a>
      <div className="footer__links">
        {Links.map((props: { text: string; url: string }, index: number) => (
          <a key={index} href={props.url}>
            {props.text}
          </a>
        ))}
      </div>
    </footer>
  );
}
