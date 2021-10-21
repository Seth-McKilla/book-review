# Book Review DataModel

DataModel implementation of the **BookReview** schema and definition.

```sh
npm install -D @datamodels/book-review
```

## Rationale

The **BookReview** contains a DID's list of all books read, their rating, and review.

By keeping a list of the books that have been read for DIDs, the Book Review provides unique opportunities for how applications can be anonymously personalized for DIDs based on their reading preferences. This also opens the door to a potential decentralized aggregation application of all book ratings and reviews across many DIDs.

**It is what you read when you don’t have to that determines what you will be when you can’t help it. – Oscar Wilde**

**DID-agnostic support:** Since Ceramic documents can be created and controlled by any DID, the Book Review can be used in conjunction with any DID method.

## Schemas

### [BookReview](./schemas/BookReview.json)

The Book Review schema defines the format of a document that contains the properties listed below. Properties not defined in the schema _cannot_ be included in the Book Review, however the schema can always be updated via a new CIP.

| Property | Description | Value   | Validation   | Required | Example                    |
| -------- | ----------- | ------- | ------------ | -------- | -------------------------- |
| `title`  | book title  | string  | max 100 char | required | 1984                       |
| `author` | book author | string  | max 100 char | required | George Orwell              |
| `rating` | book rating | number  | min 1, max 5 | required | 5                          |
| `review` | book review | unicode | max 500 char | required | Fantastic dystopian novel. |

## License

Dual licensed under MIT and Apache 2
