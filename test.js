const dateFormat = new Intl.DateTimeFormat('en-US',
    { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });

let d = new Date(2021, 6, 15, 2, 60)

console.log(dateFormat.format(d));