defmodule Rocketpay.Users.CreateTest do
  use Rocketpay.DataCase, async: true

  alias Rocketpay.User
  alias Rocketpay.Users.Create

  describe "call/1" do
    test "all parameters are valid, returns a user" do
      params = %{
        name: "Almeida",
        password: "123456",
        nickname: "Yeet",
        email: "almeidx@pm.me",
        age: 19
      }

      {:ok, %User{id: user_id}} = Create.call(params)

      user = Repo.get(User, user_id)

      assert %User{name: "Almeida", age: 19, id: ^user_id} = user
    end

    test "when some parameters are invalid, returns error" do
      params = %{
        name: "Almeida",
        nickname: "Yeet",
        email: "almeidx@pm.me",
        age: 15
      }

      {:error, changeset} = Create.call(params)

      expected_response = %{password: ["can't be blank"]}

      assert errors_on(changeset) == expected_response
    end
  end
end
