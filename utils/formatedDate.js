function formatedDate(unformatedDate) {
  const dateTime = new Date(unformatedDate);

  const date = dateTime.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const time = dateTime.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} ${time}`;
}

module.exports = formatedDate;
