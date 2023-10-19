function Link({ link, text }) {
  return (
    <a href={link} className="link">
      {text}
    </a> 
  );
}

export default Link;
