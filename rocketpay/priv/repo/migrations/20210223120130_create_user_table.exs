defmodule Rocketpay.Repo.Migrations.CreateUserTable do
  use Ecto.Migration

  # Both up and down
  def change do
    create table :users do
      add :name, :string
      add :age, :integer
      add :email, :string
      add :password_hash, :string
      add :nickname, :string

      # Adds inserted_at and updated_at
      timestamps()
    end

    create unique_index(:users, [:email])
    create unique_index(:users, [:nickname])
  end
end
