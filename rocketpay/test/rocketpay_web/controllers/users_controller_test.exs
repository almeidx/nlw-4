defmodule RocketpayWeb.UsersControllerTest do
  use RocketpayWeb.ConnCase, async: true

  describe "create/2" do
    setup %{conn: conn}, do: {:ok, conn: conn}

    test "when all parameters are valid, creates a user", %{conn: conn} do
      params = %{
        name: "Test Subject",
        password: "123456",
        nickname: "Test Subject",
        email: "test@example.com",
        age: 19
      }

      response =
        conn
        |> post(Routes.users_path(conn, :create, params))
        |> json_response(:created)

      assert %{
               "message" => "User created",
               "user" => %{
                 "account" => %{
                   "balance" => "0.00",
                   "id" => _account_id
                 },
                 "id" => _id,
                 "name" => "Test Subject",
                 "nickname" => "Test Subject"
               }
             } = response
    end
  end
end
